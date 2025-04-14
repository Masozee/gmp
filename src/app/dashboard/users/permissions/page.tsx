"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface Permission {
  id: string
  name: string
  description: string
  module: string
  roles: string[]
}

const permissions: Permission[] = [
  {
    id: "1",
    name: "create_user",
    description: "Can create new users",
    module: "Users",
    roles: ["Admin"],
  },
  {
    id: "2",
    name: "edit_user",
    description: "Can edit user details",
    module: "Users",
    roles: ["Admin", "Editor"],
  },
  {
    id: "3",
    name: "delete_user",
    description: "Can delete users",
    module: "Users",
    roles: ["Admin"],
  },
  {
    id: "4",
    name: "view_users",
    description: "Can view user list",
    module: "Users",
    roles: ["Admin", "Editor", "Viewer"],
  },
  {
    id: "5",
    name: "manage_roles",
    description: "Can manage user roles",
    module: "Roles",
    roles: ["Admin"],
  },
]

export default function PermissionsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Permissions</h1>
          <p className="text-muted-foreground">
            Configure system permissions
          </p>
        </div>
        <Button>
          <Lock className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Permissions List</CardTitle>
            <CardDescription>
              A list of all system permissions and their assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Assigned Roles</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      {permission.name}
                    </TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{permission.module}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {permission.roles.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch defaultChecked />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 