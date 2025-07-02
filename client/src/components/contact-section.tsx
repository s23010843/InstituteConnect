import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from "lucide-react";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Campus Address",
      content: "123 Excellence Boulevard\nUniversity City, State 12345\nUnited States",
      color: "bg-institute-blue",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      content: "Main: +1 (555) 123-4567\nAdmissions: +1 (555) 123-4568\nInternational: +1 (555) 123-4569",
      color: "bg-institute-green",
    },
    {
      icon: Mail,
      title: "Email Addresses",
      content: "info@excellence.edu\nadmissions@excellence.edu\nresearch@excellence.edu",
      color: "bg-institute-orange",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed",
      color: "bg-purple-600",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-roboto-slab text-4xl font-bold text-institute-gray mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our programs, admissions, or research opportunities? We're here to help you on your educational journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info) => (
              <div key={info.title} className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center mt-1`}>
                  <info.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-institute-gray mb-2">{info.title}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Contact Form */}
          <Card className="bg-institute-surface">
            <CardContent className="p-8">
              <h3 className="font-roboto-slab text-2xl font-bold text-institute-gray mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-institute-gray mb-2">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-institute-gray mb-2">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-institute-gray mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-institute-gray mb-2">
                    Subject
                  </Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="admissions">Admissions</SelectItem>
                      <SelectItem value="research">Research Opportunities</SelectItem>
                      <SelectItem value="campus">Campus Visit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-institute-gray mb-2">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-institute-blue hover:bg-institute-blue-dark text-white py-3 rounded-lg font-medium material-shadow transition-all"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
