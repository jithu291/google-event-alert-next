import HeroSection from '@/components/sections/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Phone, Bell, Shield, Clock, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">

      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">CallAlert</span>
            </div>
            <Button variant="outline" className="gap-2 border-gray-300 hover:bg-gray-50">
              <Shield className="w-4 h-4" />
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4">
      <HeroSection />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto pb-20">
          <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <CardTitle className="text-black">Google Calendar Sync</CardTitle>
              <CardDescription className="text-gray-600">
                Seamlessly connect with your Google Calendar and access all your events in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <CardTitle className="text-black">Automated Calls</CardTitle>
              <CardDescription className="text-gray-600">
                Receive phone call reminders powered by Twilio before your important meetings and events.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <CardTitle className="text-black">Custom Timing</CardTitle>
              <CardDescription className="text-gray-600">
                Set custom reminder times - get calls 15 minutes, 1 hour, or a day before your events.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="py-20 max-w-4xl mx-auto border-t border-gray-200">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Sign in with Google</h3>
              <p className="text-gray-600">Authenticate and grant calendar access permissions</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Configure Alerts</h3>
              <p className="text-gray-600">Set your phone number and preferred reminder times</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Receive Calls</h3>
              <p className="text-gray-600">Get automated phone reminders for your events</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 CallAlert. Powered by Google Calendar & Twilio.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}