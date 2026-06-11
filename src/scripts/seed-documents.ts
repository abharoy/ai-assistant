import axios from 'axios';

const API_URL = 'http://localhost:3000/api/rag';

const sampleDocuments = [
  {
    id: '1',
    content: 'Our office spaces in Victoria Island range from 500 to 5000 sqft with modern amenities including high-speed internet, conference rooms, and parking facilities.',
    metadata: {
      source: 'properties',
      location: 'Victoria Island, Lagos',
      category: 'office-space',
      price_range: 'Premium',
    },
  },
  {
    id: '2',
    content: 'OfficebanAO offers flexible lease terms starting from 3 months for startups and SMEs. We provide customizable office solutions tailored to your business needs.',
    metadata: {
      source: 'services',
      type: 'leasing',
      category: 'flexible-terms',
    },
  },
  {
    id: '3',
    content: 'Our Lekki office spaces feature state-of-the-art facilities including 24/7 security, backup power, and high-speed fiber internet connectivity.',
    metadata: {
      source: 'properties',
      location: 'Lekki, Lagos',
      category: 'office-space',
      price_range: 'Premium',
    },
  },
  {
    id: '4',
    content: 'OfficebanAO provides comprehensive support services including IT support, reception services, and administrative assistance for all office tenants.',
    metadata: {
      source: 'services',
      type: 'support',
      category: 'tenant-services',
    },
  },
  {
    id: '5',
    content: 'Office spaces in Ikoyi start from ₦500,000 per month. All spaces include utilities, internet, and maintenance services in the rent.',
    metadata: {
      source: 'pricing',
      location: 'Ikoyi, Lagos',
      category: 'pricing',
      price_start: 500000,
    },
  },
  {
    id: '6',
    content: 'We offer co-working spaces perfect for freelancers and small teams, with flexible daily, weekly, and monthly membership options.',
    metadata: {
      source: 'services',
      type: 'coworking',
      category: 'office-space',
    },
  },
  {
    id: '7',
    content: 'All OfficebanAO properties are strategically located in major business districts with easy access to public transportation, restaurants, and retail services.',
    metadata: {
      source: 'general-info',
      category: 'location-benefits',
    },
  },
  {
    id: '8',
    content: 'Contact our leasing team at hello@officebanao.com or call 0700-OFFICEBANAO for property tours and customized quotations.',
    metadata: {
      source: 'contact',
      type: 'support-contact',
    },
  },
];

async function seedDocuments() {
  try {
    console.log('🌱 Starting document seeding...');

    const response = await axios.post(`${API_URL}/ingest`, {
      documents: sampleDocuments,
    });

    console.log('✓ Documents seeded successfully!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('✗ Seeding failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

seedDocuments();