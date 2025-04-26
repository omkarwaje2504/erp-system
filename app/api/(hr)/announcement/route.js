import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const announcements = await prisma.announcement.findMany();
    return NextResponse.json(
      { status: 'success', data: announcements },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch announcements', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, postedBy, dateTime, description, documentUrl } = body;
    if (!title || !postedBy || !dateTime || !description) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields: title, postedBy, dateTime, description' },
        { status: 400 }
      );
    }
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        postedBy,
        dateTime: new Date(dateTime),
        description,
        documentUrl: documentUrl || null
      }
    });
    return NextResponse.json(
      { status: 'success', data: newAnnouncement, message: 'Announcement created successfully' },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to create announcement', error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, documentUrl, dateTime } = body;
    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Announcement ID is required for update' },
        { status: 400 }
      );
    }
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (documentUrl !== undefined) updateData.documentUrl = documentUrl;
    if (dateTime !== undefined) updateData.dateTime = new Date(dateTime);

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: id },
      data: updateData
    });
    return NextResponse.json(
      { status: 'success', data: updatedAnnouncement, message: 'Announcement updated successfully' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to update announcement', error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idParam = searchParams.get('id');
    if (!idParam) {
      return NextResponse.json(
        { status: 'error', message: 'Announcement ID is required for deletion' },
        { status: 400 }
      );
    }
    const id = parseInt(idParam, 10);
    await prisma.announcement.delete({ where: { id: id } });
    return NextResponse.json(
      { status: 'success', message: 'Announcement deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete announcement', error: err.message },
      { status: 500 }
    );
  }
}
