//app\api\users\[userId]\locations\route.ts

import { NextRequest, NextResponse } from "next/server";
import { apiClient, ApiError } from "@/components/utils/api-client";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const { userId } = await params;
  try {
    const searchParams = request.nextUrl.searchParams;

    const { data } = await apiClient.get(`/users/${userId}/locations`, {
      params: {
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.message ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).response?.status ?? 500 },
    );
  }
}
