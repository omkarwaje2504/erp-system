import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      productId,
      category,
      description,
      b2bPrice,
      b2cPrice,
      stock,
      imageUrl,
    } = body;

    if (!name || !productId || !category || !stock) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let savedProduct;

    if (id) {
      savedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          productId,
          category,
          description,
          b2bPrice: b2bPrice ? parseFloat(b2bPrice) : undefined,
          b2cPrice: b2cPrice ? parseFloat(b2cPrice) : undefined,
          stock: parseInt(stock),
          imageUrl,
        },
      });
    } else {
      savedProduct = await prisma.product.create({
        data: {
          name,
          productId,
          category,
          description,

          b2bPrice: b2bPrice ? parseFloat(b2bPrice) : undefined,
          b2cPrice: b2cPrice ? parseFloat(b2cPrice) : undefined,
          stock: parseInt(stock),
          imageUrl,
        },
      });
    }

    return NextResponse.json(
      {
        message: `Product ${id ? "updated" : "created"} successfully`,
        product: savedProduct,
      },
      { status: id ? 200 : 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Product save failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        productOrders: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
