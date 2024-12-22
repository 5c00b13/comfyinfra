import { ServiceType } from '../../../types';

export interface ServiceCategory {
  name: string;
  services: Array<{
    type: ServiceType;
    label: string;
    iconUrl: string;
  }>;
}

export const serviceCategories: ServiceCategory[] = [
  {
    name: 'Databases',
    services: [
      {
        type: 'postgres',
        label: 'PostgreSQL',
        iconUrl: 'https://www.postgresql.org/media/img/about/press/elephant.png'
      },
      {
        type: 'mongodb',
        label: 'MongoDB',
        iconUrl: 'https://www.mongodb.com/assets/images/global/leaf.png'
      },
      {
        type: 'redis',
        label: 'Redis',
        iconUrl: 'https://redis.com/wp-content/themes/wpx/assets/images/logo-redis.svg'
      },
      {
        type: 'supabase',
        label: 'Supabase',
        iconUrl: 'https://supabase.com/dashboard/img/supabase-logo.svg'
      },
      {
        type: 'planetscale',
        label: 'PlanetScale',
        iconUrl: 'https://planetscale.com/favicon.svg'
      }
    ]
  },
  {
    name: 'APIs',
    services: [
      {
        type: 'facebook',
        label: 'Facebook API',
        iconUrl: 'https://www.facebook.com/images/fb_icon_325x325.png'
      },
      {
        type: 'github',
        label: 'GitHub API',
        iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
      },
      {
        type: 'stripe',
        label: 'Stripe',
        iconUrl: 'https://stripe.com/img/v3/home/twitter.png'
      },
      {
        type: 'twilio',
        label: 'Twilio',
        iconUrl: 'https://www.twilio.com/assets/icons/twilio-icon-512.png'
      }
    ]
  },
  {
    name: 'Cloud',
    services: [
      {
        type: 'aws-lambda',
        label: 'AWS Lambda',
        iconUrl: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png'
      },
      {
        type: 'cloudflare',
        label: 'Cloudflare',
        iconUrl: 'https://www.cloudflare.com/img/cf-facebook-card.png'
      },
      {
        type: 'vercel',
        label: 'Vercel',
        iconUrl: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png'
      }
    ]
  },
  {
    name: 'Queue',
    services: [
      {
        type: 'rabbitmq',
        label: 'RabbitMQ',
        iconUrl: 'https://www.rabbitmq.com/img/logo-rabbitmq.svg'
      },
      {
        type: 'kafka',
        label: 'Kafka',
        iconUrl: 'https://kafka.apache.org/logos/kafka_logo--simple.png'
      },
      {
        type: 'redis-pubsub',
        label: 'Redis PubSub',
        iconUrl: 'https://redis.com/wp-content/themes/wpx/assets/images/logo-redis.svg'
      }
    ]
  }
];