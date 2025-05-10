import { SearchHeader } from "@/components/SearchHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Award, Calendar, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
const Index = () => {
  const {
    t
  } = useTranslation();
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 md:pt-28 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                #1 Racket Sports Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-transparent bg-clip-text">
                {t('home.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/register">
                    {t('nav.register')} <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/all-duo-leagues">{t('league.viewAll')}</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in hidden md:block">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-300 opacity-20 filter blur-3xl animate-pulse-soft"></div>
              <div className="relative transform rotate-6 animate-float">
                <img alt="Racket sports" className="relative rounded-2xl shadow-xl border-8 border-white" src="https://www.lta.org.uk/49c827/contentassets/39501a7254d04e17a9833684b2aa75a5/padel-launch_42.jpg" />
              </div>
            </div>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 opacity-10 filter blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600 opacity-10 filter blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text">
            Everything You Need For Competitive Play
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Organized Tournaments</h3>
                <p className="text-gray-600">Join leagues and tournaments suited to your skill level and availability.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">DUO Partnerships</h3>
                <p className="text-gray-600">Find the perfect partner for doubles play and rise through the rankings together.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Track Your Progress</h3>
                <p className="text-gray-600">See your match history, track improvements, and celebrate victories.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text">
            What Players Say About Us
          </h2>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "RaketLeague transformed my playing experience. I've met great partners and improved my skills dramatically through regular competitive play."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-200"></div>
                    <div className="ml-3">
                      <p className="font-medium">Sophie Martin</p>
                      <p className="text-sm text-gray-500">Doubles player since 2024</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "The tournament organization is flawless. I love the challenge of rising through the rankings and the community is incredibly supportive."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-200"></div>
                    <div className="ml-3">
                      <p className="font-medium">Marc Dupont</p>
                      <p className="text-sm text-gray-500">Singles champion 2023</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Elevate Your Game?
            </h2>
            <p className="text-blue-100 text-lg">
              Join thousands of players already competing, improving, and having fun on RaketLeague.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/register">
                  Get Started Now <ArrowRight className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Leagues */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text">
              Featured Tournaments
            </h2>
            <Button asChild variant="outline">
              <Link to="/all-duo-leagues">{t('league.viewAll')}</Link>
            </Button>
          </div>
          <SearchHeader onSearch={() => {}} showDuoOnly={true} />
        </div>
      </section>
    </div>;
};
export default Index;