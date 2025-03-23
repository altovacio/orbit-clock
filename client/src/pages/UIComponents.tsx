import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Button,
  Calendar,
  Card,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  Label,
  Progress,
  Select,
  Separator,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  Toaster,
  Toggle,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  RadioGroup,
  RadioGroupItem
} from "@/components/ui";
import { ChevronDown, Rocket, AlertCircle, Info } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";

interface DemoFormValues {
  email: string;
  password: string;
  bio: string;
  slider: number;
  date: Date;
  progress: number;
}

export default function UIComponents() {
  const form = useForm<DemoFormValues>();

  return (
    <TooltipProvider>
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold">UI Components Showcase</h1>
          <Button asChild>
            <Link href="/">← Back to App</Link>
          </Button>
        </div>

        {/* Basic Components */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Basic Components</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Buttons</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button>Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Badges</Label>
                <div className="flex gap-2 flex-wrap">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Avatar</Label>
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label>Tooltip</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip example</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Toggle</Label>
                <Toggle aria-label="Toggle italic">
                  <Rocket className="h-4 w-4" />
                </Toggle>
              </div>

              <div className="space-y-2">
                <Label>Checkbox</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Switch</Label>
                <Switch />
              </div>
            </div>
          </div>
        </Card>

        {/* Form Components */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
          <Form {...form}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="bio"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  name="slider"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Slider</FormLabel>
                      <FormControl>
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="date"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Calendar</FormLabel>
                      <FormControl>
                        <Calendar mode="single" className="rounded-md border" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="progress"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Progress</FormLabel>
                      <FormControl>
                        <Progress value={66} className="w-full" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </Card>

        {/* Complex Components */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Complex Components</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Accordion Item 1</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Accordion Item 2</AccordionTrigger>
                  <AccordionContent>
                    This is the content for the second accordion item.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Accordion Item 3</AccordionTrigger>
                  <AccordionContent>
                    Here is some information related to the third item.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Accordion Item 4</AccordionTrigger>
                  <AccordionContent>
                    The fourth item contains additional details.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Dropdown Menu <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Account Content</TabsContent>
                <TabsContent value="password">Password Content</TabsContent>
              </Tabs>

              {/* Drawer Example */}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Demo Drawer</DrawerTitle>
                    <DrawerDescription>This is a temporary drawer content</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Drawer content goes here. Click outside or press ESC to close.
                    </p>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* Popover Example */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Show Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium leading-none">Information</h4>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This is a popover component with custom content.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Menubar Example */}
            <div className="space-y-4">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>New</MenubarItem>
                    <MenubarItem>Open</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Exit</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>

            {/* Radio Group Example */}
            <RadioGroup defaultValue="option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>
        </Card>

        {/* Loading States */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
          <div className="flex gap-6">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
} 