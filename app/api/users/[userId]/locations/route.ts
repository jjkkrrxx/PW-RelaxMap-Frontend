import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const { userId } = await params;

  try {
    const backendUrl = process.env.BACKEND_URL;

    const response = await axios.get(
      `${backendUrl}/api/users/${userId}/locations`,
      {
        params: request.nextUrl.searchParams,
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          message: error.response?.data?.message ?? error.message,
        },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
