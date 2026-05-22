"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateMyProfile } from "@/features/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProfileSettingsFormProps = {
  initialFullName: string;
  initialRollNumber: string | null;
  initialDepartment: string | null;
  initialBio: string | null;
  initialAvatarUrl: string | null;
};

export function ProfileSettingsForm({
  initialFullName,
  initialRollNumber,
  initialDepartment,
  initialBio,
  initialAvatarUrl,
}: ProfileSettingsFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [rollNumber, setRollNumber] = useState(initialRollNumber ?? "");
  const [department, setDepartment] = useState(initialDepartment ?? "");
  const [bio, setBio] = useState(initialBio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [isPending, startTransition] = useTransition();
  const avatarPreview = avatarUrl.trim();

  function onAvatarFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        toast.error("Failed to read image file.");
        return;
      }
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateMyProfile({
        fullName: fullName.trim(),
        rollNumber: rollNumber.trim(),
        department: department.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated successfully.");
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Enter your full name"
          required
          minLength={2}
          maxLength={80}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="roll_number">Roll Number</Label>
          <Input
            id="roll_number"
            name="roll_number"
            value={rollNumber}
            onChange={(event) => setRollNumber(event.target.value)}
            placeholder="BSCS-23-001"
            maxLength={40}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            placeholder="Computer Science"
            maxLength={120}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar_url">Display Picture URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar_file">Upload Display Picture</Label>
        <Input id="avatar_file" name="avatar_file" type="file" accept="image/*" onChange={onAvatarFileChange} />
        <p className="text-xs text-muted-foreground">Supported: image files up to 2MB.</p>
      </div>
      {avatarPreview ? (
        <div className="space-y-2">
          <Label>Preview</Label>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarPreview} alt="Avatar preview" className="h-20 w-20 rounded-full border object-cover" />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Write a short intro about yourself..."
          maxLength={500}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
