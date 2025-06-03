import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get('network');
  const { address } = await params;

  const url = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:3000';

  try {
    const response = await axios.get(
      `${url}/leaderboard/${address}?network=${network}`,
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = response.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard data for address:', error);

    // Handle 404 specifically
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Address not found in leaderboard' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Failed to fetch leaderboard data for address' },
      { status: 500 },
    );
  }
}
