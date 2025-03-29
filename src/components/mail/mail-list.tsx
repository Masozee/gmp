"use client"

import Link from "next/link"
import { Mail, Filter, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function MailList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mail Records</CardTitle>
        <CardDescription>
          Browse and filter all mail records in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search mail..."
              className="w-[250px]"
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <div className="flex items-center">
                  Mail Number
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Sample data - would be replaced with actual data from API */}
            <TableRow>
              <TableCell className="font-medium">0090/SK/III/2025</TableCell>
              <TableCell>Official Statement - Department of Finance</TableCell>
              <TableCell>SK - Surat Keterangan</TableCell>
              <TableCell>Mar 15, 2025</TableCell>
              <TableCell>
                <Badge variant="outline">Outgoing</Badge>
              </TableCell>
              <TableCell>
                <Badge>Published</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/mail/0090-SK-III-2025`}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">0089/UM/III/2025</TableCell>
              <TableCell>Invitation to Annual Meeting</TableCell>
              <TableCell>UM - Undangan Meeting</TableCell>
              <TableCell>Mar 14, 2025</TableCell>
              <TableCell>
                <Badge variant="outline">Outgoing</Badge>
              </TableCell>
              <TableCell>
                <Badge>Published</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/mail/0089-UM-III-2025`}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">REF-2025/032</TableCell>
              <TableCell>Budget Approval Request</TableCell>
              <TableCell>SP - Surat Pemberitahuan</TableCell>
              <TableCell>Mar 12, 2025</TableCell>
              <TableCell>
                <Badge variant="outline">Incoming</Badge>
              </TableCell>
              <TableCell>
                <Badge>Published</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/mail/REF-2025-032`}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">0088/SK/III/2025</TableCell>
              <TableCell>Employee Certificate</TableCell>
              <TableCell>SK - Surat Keterangan</TableCell>
              <TableCell>Mar 10, 2025</TableCell>
              <TableCell>
                <Badge variant="outline">Outgoing</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Draft</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/mail/0088-SK-III-2025`}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">REF-2025/031</TableCell>
              <TableCell>Vendor Contract Renewal</TableCell>
              <TableCell>SP - Surat Pemberitahuan</TableCell>
              <TableCell>Mar 8, 2025</TableCell>
              <TableCell>
                <Badge variant="outline">Incoming</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">Archived</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/mail/REF-2025-031`}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 