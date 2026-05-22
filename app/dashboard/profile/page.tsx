import { ProfileSettingsForm } from "@/components/users/profile-settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";

export default async function ProfilePage() {
  const { profile } = await requireRole(["student", "teacher", "staff", "admin"]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="section-heading">Profile</h1>
        <p className="text-sm text-muted-foreground">Customize your account details and display picture.</p>
      </div>
      <Card className="border-indigo-100">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile, roll number, department, bio, and avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileSettingsForm
            initialFullName={profile.full_name}
            initialRollNumber={profile.roll_number}
            initialDepartment={profile.department}
            initialBio={profile.bio}
            initialAvatarUrl={profile.avatar_url}
          />
        </CardContent>
      </Card>
    </div>
  );
}
