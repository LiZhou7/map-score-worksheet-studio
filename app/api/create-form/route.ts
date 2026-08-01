import { NextResponse } from "next/server";

const FORMS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTgoSSt6LrqwxXQx4KketOMMRiahRWdqsxCal5HtJ2JndQ_DKBqYvgWed1KE8CIEgOHA/exec";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(FORMS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
    });

    const text = await response.text();
    let result: { editUrl?: string; publishedUrl?: string; error?: string };
    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: `Google Forms connector returned an unexpected response (${response.status}).` },
        { status: 502 },
      );
    }

    if (!response.ok || !result.editUrl) {
      return NextResponse.json({ error: result.error || "Google Form creation failed." }, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Google Form creation failed." },
      { status: 500 },
    );
  }
}
