"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { createRequest } from "@/features/requests/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RequestForm() {
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    const payload = {
      request_type: String(formData.get("request_type")) as "complaint" | "document",
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      category: String(formData.get("category")),
      priority: String(formData.get("priority")) as "low" | "medium" | "high",
    };

    startTransition(async () => {
      const result = await createRequest(payload);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Request submitted successfully.");
      }
    });
  }

  return (
    <Card className="border-indigo-100/80">
      <CardHeader>
        <CardTitle>Submit a new request</CardTitle>
        <CardDescription>Use this for complaints and document services.</CardDescription>
      </CardHeader>
      <CardContent className="pt-1">
        <form action={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="request_type">Request Type</Label>
            <select
              id="request_type"
              name="request_type"
              className="h-11 w-full rounded-xl border border-indigo-100 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="complaint">Complaint</option>
              <option value="document">Document Request</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="IT, Hostel, Exam Branch..." required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Short summary of your request" required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Details</Label>
            <Textarea id="description" name="description" placeholder="Describe your issue with details..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              name="priority"
              className="h-11 w-full rounded-xl border border-indigo-100 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Button disabled={isPending} type="submit">
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
