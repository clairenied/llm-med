import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { abstract: { contains: search, mode: "insensitive" as const } },
            { keywords: { hasSome: [search] } },
            {
              authors: {
                some: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {};

    // Get total count for pagination metadata
    const totalCount = await prisma.manuscript.count({
      where: whereClause,
    });

    // Get paginated manuscripts
    const manuscripts = await prisma.manuscript.findMany({
      where: whereClause,
      include: {
        authors: true,
        sources: {
          include: {
            source: true,
          },
        },
        versions: {
          include: {
            reviews: {
              include: {
                reviewer: true,
              },
            },
          },
          orderBy: {
            versionNumber: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      manuscripts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error("Error fetching manuscripts:", error);
    return NextResponse.json(
      { error: "Failed to fetch manuscripts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, abstract, keywords, authorIds } = body;

    const manuscript = await prisma.manuscript.create({
      data: {
        title,
        abstract,
        keywords,
        authors: {
          connect: authorIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        authors: true,
        versions: {
          include: {
            reviews: {
              include: {
                reviewer: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(manuscript, { status: 201 });
  } catch (error) {
    console.error("Error creating manuscript:", error);
    return NextResponse.json(
      { error: "Failed to create manuscript" },
      { status: 500 },
    );
  }
}
