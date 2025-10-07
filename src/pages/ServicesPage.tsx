import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { CheckCircle, Loader2, Rocket, Brain, Palette, Wrench, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ServicesPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    org_name: '',
    description: '',
    budget_range: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const services = [
    {
      icon: <Rocket className="w-8 h-8 text-blue-400" />,
      title: "MVP Development",
      description: "Transform your idea into a functional minimum viable product with modern tech stack and scalable architecture.",
      features: ["React/TypeScript", "Database Design", "API Development", "Deployment"]
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: "AI Prototypes",
      description: "Build intelligent applications with machine learning, natural language processing, and computer vision capabilities.",
      features: ["ML Integration", "AI APIs", "Data Processing", "Model Training"]
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-400" />,
      title: "UX/Design",
      description: "Create stunning user experiences with modern design principles, user research, and interactive prototypes.",
      features: ["UI/UX Design", "Prototyping", "User Research", "Design Systems"]
    },
    {
      icon: <Wrench className="w-8 h-8 text-green-400" />,
      title: "Creative Tools",
      description: "Develop specialized tools and applications for creative workflows, content generation, and productivity.",
      features: ["Custom Tools", "Automation", "Workflow Design", "Integration"]
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-400" />,
      title: "Maintenance & Support",
      description: "Ongoing support, updates, and maintenance for your applications with 24/7 monitoring and quick response.",
      features: ["24/7 Monitoring", "Bug Fixes", "Updates", "Performance Optimization"]
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('client_applications')
        .insert([formData])

      if (error) throw error

      setSuccess(true)
      setFormData({ email: '', org_name: '', description: '', budget_range: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-gray-400 mb-8">
              Thank you for your interest in partnering with Quantara. We'll review your application and get back to you within 48 hours.
            </p>
            <Button 
              onClick={() => setSuccess(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Premium <span className="text-blue-400">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Partner with Quantara to bring your vision to life. We offer premium development services 
            for startups and enterprises looking to build the future.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="mb-4">{service.icon}</div>
                <CardTitle className="text-white">{service.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Apply for Partnership</CardTitle>
              <CardDescription className="text-gray-400">
                Tell us about your project and let's build something amazing together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="org_name" className="text-white">Organization Name</Label>
                    <Input
                      id="org_name"
                      type="text"
                      value={formData.org_name}
                      onChange={(e) => handleInputChange('org_name', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget_range" className="text-white">Budget Range</Label>
                  <Select value={formData.budget_range} onValueChange={(value) => handleInputChange('budget_range', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="<$5k">Less than $5,000</SelectItem>
                      <SelectItem value="$5k-$20k">$5,000 - $20,000</SelectItem>
                      <SelectItem value="$20k-$50k">$20,000 - $50,000</SelectItem>
                      <SelectItem value="$50k+">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                    placeholder="Tell us about your project, goals, and requirements..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage