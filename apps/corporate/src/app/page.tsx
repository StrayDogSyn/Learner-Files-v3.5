'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Building2, Scale, Users, Zap } from 'lucide-react'
import { GlassButton, GlassCard, GlassContainer } from '@straydog/ui-components'
import { useAI } from '@straydog/ai-orchestrator'
import { useState } from 'react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Solutions',
    description: 'Leverage cutting-edge artificial intelligence to transform your business operations and decision-making processes.'
  },
  {
    icon: Scale,
    title: 'Justice Reform Technology',
    description: 'Innovative tools and platforms designed to support criminal justice reform and create positive social impact.'
  },
  {
    icon: Building2,
    title: 'Enterprise Consulting',
    description: 'Strategic consulting services to help organizations navigate digital transformation and operational excellence.'
  },
  {
    icon: Users,
    title: 'Team Development',
    description: 'Comprehensive training and development programs to upskill your workforce for the digital age.'
  }
]

const stats = [
  { label: 'Clients Served', value: '500+' },
  { label: 'AI Models Deployed', value: '50+' },
  { label: 'Success Rate', value: '98%' },
  { label: 'Years Experience', value: '10+' }
]

export default function HomePage() {
  const { generateResponse, isLoading } = useAI()
  const [aiResponse, setAiResponse] = useState<string>('')

  const handleAIDemo = async () => {
    try {
      const response = await generateResponse(
        'Explain how AI can transform business operations in 2-3 sentences.',
        { temperature: 0.7, maxTokens: 150 }
      )
      setAiResponse(response)
    } catch (error) {
      console.error('AI Demo Error:', error)
      setAiResponse('AI demo temporarily unavailable. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <GlassContainer className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="gradient-text">StrayDog Syndicate</span>
                <br />
                <span className="text-white/90">Corporate Solutions</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80"
            >
              Transforming businesses through AI-powered innovation, strategic consulting, 
              and cutting-edge technology solutions. Building the future of enterprise excellence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <GlassButton size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </GlassButton>
              
              <GlassButton 
                variant="outline" 
                size="lg"
                onClick={handleAIDemo}
                disabled={isLoading}
              >
                <Zap className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'AI Demo'}
              </GlassButton>
            </motion.div>
            
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <GlassCard className="mx-auto max-w-2xl p-6">
                  <p className="text-white/90 italic">"{aiResponse}"</p>
                  <p className="mt-2 text-sm text-tech-accent-300">— Powered by Claude AI</p>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        </GlassContainer>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="text-center p-6">
                  <div className="text-3xl font-bold text-tech-accent-300">{stat.value}</div>
                  <div className="mt-2 text-sm text-white/70">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our <span className="gradient-text">Core Services</span>
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Comprehensive solutions designed to drive innovation and growth
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full p-6 group hover:scale-105 transition-transform duration-300">
                    <div className="mb-4">
                      <Icon className="h-8 w-8 text-tech-accent-400 group-hover:text-tech-accent-300 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-8">
        <GlassContainer className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Join hundreds of organizations already leveraging our AI-powered solutions
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton size="lg" className="group">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </GlassButton>
              <GlassButton variant="outline" size="lg">
                View Case Studies
              </GlassButton>
            </div>
          </motion.div>
        </GlassContainer>
      </section>
    </div>
  )
}