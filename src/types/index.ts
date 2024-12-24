export type ServiceType = 
  // Databases
  | 'postgres' | 'mysql' | 'mongodb' | 'redis' | 'supabase' | 'planetscale'
  // APIs
  | 'facebook' | 'twitter' | 'github' | 'stripe' | 'twilio' | 'sendgrid'
  // Cloud Services
  | 'aws-lambda' | 'aws-s3' | 'cloudflare' | 'vercel' | 'netlify'
  // Message Queues
  | 'rabbitmq' | 'kafka' | 'redis-pubsub'
  // Authentication
  | 'auth0' | 'okta' | 'cognito'
  // Search
  | 'elasticsearch' | 'algolia' | 'meilisearch';

export interface InfraNode {
  id: string;
  type: ServiceType;
  label: string;
  status: 'healthy' | 'warning' | 'error' | 'deploying';
  config: Record<string, any>;
}