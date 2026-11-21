import { SubjectiveSet } from '../../types';

export const mgt301Sub: SubjectiveSet = {
  id: 'mgt301-subjective',
  courseCode: 'MGT301',
  courseTitle: 'Principles of Marketing',
  term: 'midterm',
  termLabel: 'Core & Exam Prep',
  description:
    'High-speed marketing exam prep covering Product Mix Dimensions (Width/Length/Depth), Brand Development Strategies, Pricing Methods, Derived Demand, and STP Strategy.',
  topics: [
    'Product Mix & Branding',
    'Pricing Strategies',
    'B2B & Buying Center',
    'STP Segmentation',
    'Marketing Mix & Promotion'
  ],
  questions: [
    {
      id: 'mgt301-sub-1',
      num: 1,
      question:
        'Define Product Mix and clearly distinguish among Product Mix Width, Length, Depth, and Consistency.',
      marks: 5,
      term: 'midterm',
      topic: 'Product Mix & Branding',
      quickHook: 'Width = number of lines; Length = total items across lines; Depth = variants per product; Consistency = how closely lines relate.',
      keyPoints: [
        'Product Mix (Assortment): the complete set of all product lines and items a seller offers.',
        'Width: how many different product lines the company carries (e.g., soaps, shampoos, beverages).',
        'Length: the total number of items the company carries within its product lines.',
        'Depth: the number of versions offered of each product in the line (e.g., 3 sizes × 2 scents = depth of 6).',
        'Consistency: how closely related the various product lines are in end use, production, or distribution.'
      ],
      modelAnswer:
        'A company’s Product Mix encompasses every product line and individual item it sells. It has four strategic dimensions: 1) Width refers to the total number of distinct product lines offered; 2) Length measures the cumulative count of individual products across all lines; 3) Depth counts the variations (sizes, flavors, formulas) of each individual product; and 4) Consistency indicates how closely those product lines align in end usage, manufacturing requirements, or distribution channels.'
    },
    {
      id: 'mgt301-sub-2',
      num: 2,
      question:
        'Compare the four Brand Development Strategies: Line Extension, Brand Extension, Multibrands, and New Brands.',
      marks: 5,
      term: 'midterm',
      topic: 'Product Mix & Branding',
      quickHook: '2×2 Matrix: Existing/New Brand × Existing/New Category -> Line Ext (Same+Same), Brand Ext (Existing+New Cat), Multibrand (New+Same), New Brand (New+New).',
      keyPoints: [
        'Line Extension: existing brand name + existing product category (new flavor, size, or color).',
        'Brand Extension: existing brand name launched into a NEW product category.',
        'Multibrands: NEW brand name introduced in the SAME existing product category to capture varied segments.',
        'New Brands: NEW brand name created for a NEW product category when existing equity does not fit.'
      ],
      modelAnswer:
        'Marketers choose among four brand development paths depending on product category and brand name novelty. Line Extension adds new forms, colors, or sizes under an existing brand within the same category. Brand Extension leverages a well-known brand name to enter a completely different category. Multibrands introduce additional brand names within an existing category to target distinct buyer segments or lock up shelf space. New Brands establish both a fresh name and a new product category.',
      examTip: 'Scenario questions love this 2x2 grid—check whether the category is Same/New and whether the brand name is Same/New.'
    },
    {
      id: 'mgt301-sub-3',
      num: 3,
      question:
        'Differentiate between Customer Value-Based Pricing and Cost-Based Pricing.',
      marks: 3,
      term: 'midterm',
      topic: 'Pricing Strategies',
      quickHook: 'Value-Based starts with Buyer Perceived Value -> Price -> Cost; Cost-Based starts with Product Cost -> Margin -> Price.',
      keyPoints: [
        'Customer Value-Based Pricing starts by assessing customer needs and perceived value before setting target price and designing product costs to match.',
        'Cost-Based Pricing begins with engineering/production costs, adds a fixed markup, and then tries to convince buyers the price is justified.',
        'Value-based pricing is buyer-driven; Cost-based pricing is product-driven.'
      ],
      modelAnswer:
        'Cost-Based Pricing designs a product, sums all manufacturing and distribution costs, adds a target profit margin, and sets the selling price—leaving marketers to persuade buyers later. In contrast, Customer Value-Based Pricing flips the sequence: it starts by measuring how much value buyers place on product benefits, sets a target price matching that perceived value, and then engineers costs down so the company earns an attractive margin at that price.'
    },
    {
      id: 'mgt301-sub-4',
      num: 4,
      question:
        'What is Derived Demand in business-to-business (B2B) markets, and which Buying Center role helps define technical specifications?',
      marks: 3,
      term: 'midterm',
      topic: 'B2B & Buying Center',
      quickHook: 'Derived demand = business demand pulled by consumer demand; Influencer = defines specifications & evaluates alternatives.',
      keyPoints: [
        'Derived Demand: B2B demand for raw materials, parts, and machinery ultimately originates from end-consumer demand for finished goods.',
        'Buying Center Roles include Users, Influencers, Buyers, Deciders, and Gatekeepers.',
        'Influencers (often technical staff/engineers) help define product specifications and supply information for evaluating alternatives.'
      ],
      modelAnswer:
        'Derived Demand means that organizational demand for industrial goods and services ultimately depends on final consumer demand—for instance, declining consumer demand for smartphones reduces manufacturer demand for microchips. Within an organizational Buying Center, the Influencer role (frequently technical personnel or engineers) shapes purchase decisions by establishing technical specifications and providing criteria to evaluate competing suppliers.'
    },
    {
      id: 'mgt301-sub-5',
      num: 5,
      question:
        'Explain the three steps of Customer-Driven Marketing Strategy (STP): Segmentation, Targeting, and Positioning.',
      marks: 3,
      term: 'midterm',
      topic: 'STP Segmentation',
      quickHook: 'Segment = divide market into distinct groups; Target = pick segments to serve; Position = occupy a clear mental space.',
      keyPoints: [
        'Market Segmentation divides a broad market into smaller groups with distinct needs, characteristics, or behaviors (geographic, demographic, psychographic, behavioral).',
        'Market Targeting evaluates each segment’s attractiveness and selects one or more segments to serve.',
        'Market Positioning arranges a market offering to occupy a clear, distinctive, and desirable place relative to competing products in target consumers’ minds.'
      ],
      modelAnswer:
        'Customer-driven marketing strategy follows the STP framework. First, Market Segmentation partitions diverse buyers into homogeneous sub-groups based on geography, demographics, psychographics, or behavior. Second, Market Targeting assesses segment profitability and company fit to choose which segments to serve. Third, Positioning differentiates the brand’s value proposition so it holds a distinct, compelling place in target customers’ minds compared to rivals.'
    }
  ]
};
