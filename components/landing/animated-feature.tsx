"use client";

import { motion } from "framer-motion";
import { Bell, FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  { title: "Real-Time Tracking", icon: Bell, text: "Stay updated for every status transition." },
  { title: "Service Requests", icon: FileText, text: "Complaints and document requests in one flow." },
  { title: "Role Security", icon: ShieldCheck, text: "RLS-powered access for students, staff, and admins." },
];

export function AnimatedFeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-3">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <item.icon className="size-5 text-primary" />
              </motion.div>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{item.text}</CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
