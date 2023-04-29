import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/libs/prismadb'
import getCurrentUser from '@/actions/getCurrentUser'

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.redirect('/login')
  }

  const body = await request.json()
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body

  let errorMessages: string[] = []

  Object.keys(body).forEach((key) => {
    if (!body[key]) {
      errorMessages.push(`${key} is required`)
    }
  })

  if (errorMessages.length > 0) {
    return NextResponse.json(
      { message: errorMessages.join(', ') },
      { status: 400 }
    )
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id,
    },
  })

  return NextResponse.json(listing)
}
