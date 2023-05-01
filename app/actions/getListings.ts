import prisma from '@/libs/prismadb'

export interface IListingsParams {
  userId?: string
  guestCount?: number
  roomCount?: number
  bathroomCount?: number
  startDate?: string
  endDate?: string
  locationValue?: string
  category?: string
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      locationValue,
      category,
    } = params

    let query = {
      ...(userId && { userId }),
      ...(category && { category }),
      ...(locationValue && { locationValue }),

      ...(guestCount && {
        guestCount: {
          gte: +guestCount,
        },
      }),

      ...(roomCount && {
        roomCount: {
          gte: +roomCount,
        },
      }),

      ...(bathroomCount && {
        bathroomCount: {
          gte: +bathroomCount,
        },
      }),

      ...(startDate &&
        endDate && {
          NOT: {
            reservations: {
              some: {
                OR: [
                  {
                    endDate: { gte: startDate },
                    startDate: { lte: startDate },
                  },
                  {
                    endDate: { gte: endDate },
                    startDate: { lte: endDate },
                  },
                ],
              },
            },
          },
        }),
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeListing = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }))

    return safeListing
  } catch (error: any) {
    throw new Error(error)
  }
}
