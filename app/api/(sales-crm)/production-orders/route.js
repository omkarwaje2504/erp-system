import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const {
      productId,
      productName,
      quantity,
      warehouse,
      fromWarehouse,
      toWarehouse,
      category,
      section,
    } = await req.json();

    // Validate the required fields
    if (section === "stock-movement") {
      if (!productId || !quantity || !fromWarehouse || !toWarehouse || !category) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Fetch product with related production orders
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          productOrders: true,
        },
      });

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Find the current stock in the fromWarehouse
      const fromWarehouseOrder = product.productOrders.find(
        (order) => order.warehouse === fromWarehouse
      );
      if (!fromWarehouseOrder || fromWarehouseOrder.quantity < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock in source warehouse" },
          { status: 400 }
        );
      }

      // Update the stock in the source warehouse
      await prisma.productionOrder.update({
        where: { id: fromWarehouseOrder.id },
        data: {
          quantity: fromWarehouseOrder.quantity - quantity,
        },
      });

      // Check if the toWarehouse already has a record, if not, create one
      const toWarehouseOrder = product.productOrders.find(
        (order) => order.warehouse === toWarehouse
      );

      if (toWarehouseOrder) {
        // Update the stock in the destination warehouse
        await prisma.productionOrder.update({
          where: { id: toWarehouseOrder.id },
          data: {
            quantity: toWarehouseOrder.quantity + quantity,
          },
        });
      } else {
        // Create a new production order for the destination warehouse
        await prisma.productionOrder.create({
          data: {
            productId,
            productName,
            warehouse: toWarehouse,
            quantity:parseInt(quantity),
            status: "Completed",
          },
        });
      }

      // Create a stock movement record
      const stockMovement = await prisma.stockMovement.create({
        data: {
          productId,
          quantity:parseInt(quantity),
          fromWarehouse,
          toWarehouse,
          type: category,
        },
      });

      return NextResponse.json(
        { message: "Stock transfer successful", stockMovement },
        { status: 200 }
      );
    }else {
      if (!productId || !productName || !warehouse || !quantity) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      const order = await prisma.productionOrder.create({
        data: {
          productId,
          productName,
          warehouse,
          quantity: parseInt(quantity),
        },
      });

      return NextResponse.json(
        { message: "Production order created", order },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error transferring stock:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const productionOrders = await prisma.productionOrder.findMany({
      include: {
        product: {
          select: {
            name: true, // Product details
            category: true,
            warehouse: true, // Include related warehouse details for the product
          },
        },
        warehouse: true, // Warehouse details from the production order
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(productionOrders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
