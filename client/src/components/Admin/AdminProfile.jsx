import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch admin profile from backend
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await apiRequest("GET", "/api/admin/profile", null, {
          Authorization: `Bearer ${token}`,
        });
        setAdmin(res.admin);
        setName(res.admin.name);
        setEmail(res.admin.email);
      } catch (err) {
        setAdmin(null);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("adminToken");
      return apiRequest(
        "PATCH",
        "/api/admin/profile",
        { name, email },
        { Authorization: `Bearer ${token}` }
      );
    },
    onSuccess: (data) => {
      setAdmin((prev) => ({ ...prev, name, email }));
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Profile",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const updatePassword = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords don't match");
      }
      const token = localStorage.getItem("adminToken");
      return apiRequest(
        "PATCH",
        "/api/admin/profile/password",
        { currentPassword, newPassword },
        { Authorization: `Bearer ${token}` }
      );
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Password",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile.mutate();
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    updatePassword.mutate();
  };

  if (!admin) {
    return (
      <div className="flex justify-center mt-8">
        <span className="text-neutral-500">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center">
        <Avatar className="h-24 w-24 mr-6">
          <AvatarImage src={admin.profileImage} alt={admin.name} />
          <AvatarFallback className="text-lg">{admin.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{admin.name}</h2>
          <p className="text-neutral-500 mt-1">{admin.role}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to maintain account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={updatePassword.isPending}
                  >
                    {updatePassword.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile;