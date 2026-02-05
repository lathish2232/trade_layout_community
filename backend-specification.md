# Backend Specification: Query, Article, and Discussion Features

## Database Structure

### Users Table
```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `display_name` varchar(200) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `auth_provider` enum('EMAIL','GOOGLE','FACEBOOK','X') NOT NULL,
  `provider_id` varchar(100) DEFAULT NULL,
  `provider_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  `updated_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `trading_experience` varchar(50) DEFAULT NULL,
  `income_range` varchar(50) DEFAULT NULL,
  `trading_interest_stock` tinyint(1) DEFAULT '0',
  `trading_interest_futures` tinyint(1) DEFAULT '0',
  `trading_interest_none` tinyint(1) DEFAULT '0',
  `automation_interest` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  UNIQUE KEY `ix_users_user_id` (`user_id`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### Categories Table
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT 'blue',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
('Beginner', 'beginner', 'Getting started with trading', 'green'),
('Trading Strategies', 'trading-strategies', 'Share and discuss trading strategies', 'blue'),
('Subscription and Pricing', 'subscription-pricing', 'Platform subscription and pricing discussions', 'purple'),
('Broker Connectivity', 'broker-connectivity', 'Broker integration and API discussions', 'orange'),
('Backtesting', 'backtesting', 'Strategy backtesting and optimization', 'teal'),
('Live Trading', 'live-trading', 'Live trading discussions and automation', 'red');
```

### Queries Table
```sql
CREATE TABLE queries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    status ENUM('open', 'closed', 'resolved') DEFAULT 'open',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FULLTEXT(title, content)
);
```

### Articles Table
```sql
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image_url VARCHAR(500),
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    tags JSON, -- Array of tags
    read_time INT DEFAULT 5, -- Estimated reading time in minutes
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FULLTEXT(title, content, excerpt)
);
```

### Discussions Table
```sql
CREATE TABLE discussions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    tags JSON, -- Array of tags
    has_poll BOOLEAN DEFAULT FALSE,
    poll_options JSON, -- Array of poll options if has_poll is true
    status ENUM('active', 'closed', 'archived') DEFAULT 'active',
    views INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FULLTEXT(title, content)
);
```

### Poll Votes Table
```sql
CREATE TABLE poll_votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discussion_id INT NOT NULL,
    user_id INT NOT NULL,
    option_index INT NOT NULL, -- Index of the selected option
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (discussion_id, user_id)
);
```

### Comments Table
```sql
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    parent_type ENUM('query', 'article', 'discussion') NOT NULL,
    parent_id INT NOT NULL,
    parent_comment_id INT NULL, -- For nested comments
    likes_count INT DEFAULT 0,
    status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_type, parent_id)
);
```

### Likes Table
```sql
CREATE TABLE likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    target_type ENUM('query', 'article', 'discussion', 'comment') NOT NULL,
    target_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, target_type, target_id),
    INDEX idx_target (target_type, target_id)
);
```

### Tags Table
```sql
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
```json
// Request
{
    "email": "user@example.com",
    "password": "password123",
    "display_name": "John Doe",
    "full_name": "John Doe"
}

// Response
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "user_id": "usr_123456",
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "display_name": "John Doe",
            "avatar_url": null,
            "auth_provider": "EMAIL",
            "is_active": 1,
            "email_verified": 1,
            "trading_experience": "intermediate",
            "income_range": "50k-100k",
            "trading_interest_stock": 1,
            "trading_interest_futures": 0,
            "trading_interest_none": 0,
            "automation_interest": "high",
            "created_at": "2024-01-15T10:30:00Z",
            "last_login": "2024-01-15T10:30:00Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

#### POST /api/auth/login
```json
// Request
{
    "email": "user@example.com",
    "password": "password123"
}

// Response
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "user_id": "usr_123456",
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "display_name": "John Doe",
            "avatar_url": null,
            "auth_provider": "EMAIL",
            "is_active": 1,
            "email_verified": 1,
            "trading_experience": "intermediate",
            "income_range": "50k-100k",
            "trading_interest_stock": 1,
            "trading_interest_futures": 0,
            "trading_interest_none": 0,
            "automation_interest": "high",
            "last_login": "2024-01-15T10:30:00Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### Query Endpoints

#### GET /api/queries
```json
// Query Parameters: page, limit, category, search, sort

// Response
{
    "success": true,
    "data": {
        "queries": [
            {
                "id": 1,
                "title": "Best strategies for day trading crypto",
                "content": "I've been day trading crypto for 6 months...",
                "excerpt": "I've been day trading crypto for 6 months and wanted to share...",
                "author": {
                    "id": 1,
                    "user_id": "usr_123456",
                    "display_name": "CryptoTrader99",
                    "avatar_url": null,
                    "trading_experience": "advanced",
                    "trading_interest_stock": 1,
                    "trading_interest_futures": 1,
                    "automation_interest": "medium"
                },
                "category": {
                    "id": 2,
                    "name": "Trading Strategies",
                    "slug": "trading-strategies",
                    "color": "blue"
                },
                "status": "open",
                "views": 234,
                "comments_count": 12,
                "likes_count": 45,
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T10:30:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 10,
            "total_items": 100,
            "has_next": true,
            "has_prev": false
        }
    }
}
```

#### GET /api/queries/:id
```json
// Response
{
    "success": true,
    "data": {
        "query": {
            "id": 1,
            "title": "Best strategies for day trading crypto",
            "content": "I've been day trading crypto for 6 months and wanted to share some strategies that have worked well for me. Focus on high-volume coins during peak hours...",
            "author": {
                "id": 1,
                "user_id": "usr_123456",
                "display_name": "CryptoTrader99",
                "avatar_url": null,
                "trading_experience": "advanced",
                "trading_interest_stock": 1,
                "trading_interest_futures": 1,
                "automation_interest": "medium",
                "created_at": "2024-01-01T00:00:00Z"
            },
            "category": {
                "id": 2,
                "name": "Trading Strategies",
                "slug": "trading-strategies",
                "color": "blue"
            },
            "status": "open",
            "views": 235,
            "comments_count": 12,
            "likes_count": 45,
            "is_liked": false,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        },
        "comments": [
            {
                "id": 1,
                "content": "Great insights! I've been using similar strategies...",
                "author": {
                    "id": 2,
                    "display_name": "TraderJoe",
                    "avatar_url": null
                },
                "likes_count": 5,
                "is_liked": false,
                "created_at": "2024-01-15T11:00:00Z",
                "replies": []
            }
        ]
    }
}
```

#### POST /api/queries
```json
// Request
{
    "title": "How to handle volatile markets?",
    "content": "I'm struggling with market volatility and need advice on risk management strategies...",
    "category_id": 4
}

// Response
{
    "success": true,
    "data": {
        "query": {
            "id": 123,
            "title": "How to handle volatile markets?",
            "content": "I'm struggling with market volatility and need advice on risk management strategies...",
            "author": {
                "id": 1,
                "display_name": "CurrentUser"
            },
            "category": {
                "id": 4,
                "name": "Risk Management",
                "slug": "risk-management"
            },
            "status": "open",
            "views": 0,
            "comments_count": 0,
            "likes_count": 0,
            "created_at": "2024-01-15T12:00:00Z"
        }
    }
}
```

### Article Endpoints

#### GET /api/articles
```json
// Query Parameters: page, limit, category, search, sort, status, author

// Response
{
    "success": true,
    "data": {
        "articles": [
            {
                "id": 1,
                "title": "Complete Guide to Technical Analysis",
                "excerpt": "Learn the fundamentals of technical analysis...",
                "cover_image_url": "https://example.com/cover.jpg",
                "author": {
                    "id": 1,
                    "display_name": "TechAnalyst",
                    "avatar_url": null
                },
                "category": {
                    "id": 2,
                    "name": "Technical Analysis",
                    "slug": "technical-analysis"
                },
                "tags": ["technical-analysis", "indicators", "charts"],
                "read_time": 8,
                "status": "published",
                "views": 1250,
                "likes_count": 89,
                "comments_count": 23,
                "published_at": "2024-01-10T09:00:00Z",
                "created_at": "2024-01-10T09:00:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 50
        }
    }
}
```

#### GET /api/articles/:id
```json
// Response
{
    "success": true,
    "data": {
        "article": {
            "id": 1,
            "title": "Complete Guide to Technical Analysis",
            "content": "Technical analysis is a method of evaluating securities by analyzing statistics generated...",
            "excerpt": "Learn the fundamentals of technical analysis...",
            "cover_image_url": "https://example.com/cover.jpg",
            "author": {
                "id": 1,
                "display_name": "TechAnalyst",
                "avatar_url": null
            },
            "category": {
                "id": 2,
                "name": "Technical Analysis",
                "slug": "technical-analysis"
            },
            "tags": ["technical-analysis", "indicators", "charts"],
            "read_time": 8,
            "status": "published",
            "views": 1251,
            "likes_count": 89,
            "is_liked": false,
            "comments_count": 23,
            "published_at": "2024-01-10T09:00:00Z",
            "created_at": "2024-01-10T09:00:00Z"
        }
    }
}
```

#### POST /api/articles
```json
// Request
{
    "title": "Understanding Market Psychology",
    "content": "Market psychology plays a crucial role in trading decisions...",
    "excerpt": "Explore the psychological factors that influence market behavior...",
    "cover_image_url": "https://example.com/cover.jpg",
    "category_id": 5,
    "tags": ["psychology", "behavioral-finance", "trading-mindset"],
    "read_time": 6,
    "status": "draft"
}

// Response
{
    "success": true,
    "data": {
        "article": {
            "id": 45,
            "title": "Understanding Market Psychology",
            "content": "Market psychology plays a crucial role in trading decisions...",
            "excerpt": "Explore the psychological factors that influence market behavior...",
            "cover_image_url": "https://example.com/cover.jpg",
            "author": {
                "id": 1,
                "display_name": "CurrentUser"
            },
            "category": {
                "id": 5,
                "name": "Psychology",
                "slug": "psychology"
            },
            "tags": ["psychology", "behavioral-finance", "trading-mindset"],
            "read_time": 6,
            "status": "draft",
            "views": 0,
            "likes_count": 0,
            "comments_count": 0,
            "created_at": "2024-01-15T12:30:00Z"
        }
    }
}
```

### Discussion Endpoints

#### GET /api/discussions
```json
// Query Parameters: page, limit, category, search, sort, tags

// Response
{
    "success": true,
    "data": {
        "discussions": [
            {
                "id": 1,
                "title": "What's your favorite trading platform?",
                "content": "I'm curious about everyone's preferred trading platforms...",
                "excerpt": "I'm curious about everyone's preferred trading platforms and why...",
                "author": {
                    "id": 1,
                    "display_name": "PlatformExplorer",
                    "avatar_url": null
                },
                "category": {
                    "id": 1,
                    "name": "Beginner",
                    "slug": "beginner"
                },
                "tags": ["platforms", "brokers", "tools"],
                "has_poll": true,
                "poll_options": [
                    {"text": "TradingView", "votes": 45},
                    {"text": "MetaTrader", "votes": 32},
                    {"text": "Thinkorswim", "votes": 18}
                ],
                "status": "active",
                "views": 567,
                "likes_count": 78,
                "replies_count": 89,
                "created_at": "2024-01-14T14:20:00Z",
                "updated_at": "2024-01-14T16:45:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 8,
            "total_items": 80
        }
    }
}
```

#### GET /api/discussions/:id
```json
// Response
{
    "success": true,
    "data": {
        "discussion": {
            "id": 1,
            "title": "What's your favorite trading platform?",
            "content": "I'm curious about everyone's preferred trading platforms and why you chose them. I'm currently using TradingView but considering other options...",
            "author": {
                "id": 1,
                "display_name": "PlatformExplorer",
                "avatar_url": null
            },
            "category": {
                "id": 1,
                "name": "Beginner",
                "slug": "beginner"
            },
            "tags": ["platforms", "brokers", "tools"],
            "has_poll": true,
            "poll_options": [
                {"text": "TradingView", "votes": 45, "percentage": 47.4},
                {"text": "MetaTrader", "votes": 32, "percentage": 33.7},
                {"text": "Thinkorswim", "votes": 18, "percentage": 18.9}
            ],
            "user_vote": null, // or index of user's vote
            "status": "active",
            "views": 568,
            "likes_count": 78,
            "is_liked": false,
            "replies_count": 89,
            "created_at": "2024-01-14T14:20:00Z",
            "updated_at": "2024-01-14T16:45:00Z"
        },
        "replies": [
            {
                "id": 1,
                "content": "I've been using TradingView for 2 years and love it!",
                "author": {
                    "id": 2,
                    "display_name": "TradingFan",
                    "avatar_url": null
                },
                "likes_count": 12,
                "is_liked": false,
                "created_at": "2024-01-14T14:35:00Z"
            }
        ]
    }
}
```

#### POST /api/discussions
```json
// Request
{
    "title": "Best risk management strategies for beginners",
    "content": "As a new trader, I'm looking for effective risk management strategies...",
    "category_id": 4,
    "tags": ["risk-management", "beginners", "strategy"],
    "has_poll": true,
    "poll_options": [
        "Fixed percentage rule",
        "Stop loss based",
        "Position sizing",
        "Volatility based"
    ]
}

// Response
{
    "success": true,
    "data": {
        "discussion": {
            "id": 67,
            "title": "Best risk management strategies for beginners",
            "content": "As a new trader, I'm looking for effective risk management strategies...",
            "author": {
                "id": 1,
                "display_name": "CurrentUser"
            },
            "category": {
                "id": 4,
                "name": "Risk Management",
                "slug": "risk-management"
            },
            "tags": ["risk-management", "beginners", "strategy"],
            "has_poll": true,
            "poll_options": [
                {"text": "Fixed percentage rule", "votes": 0},
                {"text": "Stop loss based", "votes": 0},
                {"text": "Position sizing", "votes": 0},
                {"text": "Volatility based", "votes": 0}
            ],
            "status": "active",
            "views": 0,
            "likes_count": 0,
            "replies_count": 0,
            "created_at": "2024-01-15T13:00:00Z"
        }
    }
}
```

#### POST /api/discussions/:id/vote
```json
// Request
{
    "option_index": 1
}

// Response
{
    "success": true,
    "data": {
        "poll_options": [
            {"text": "Fixed percentage rule", "votes": 5, "percentage": 25.0},
            {"text": "Stop loss based", "votes": 8, "percentage": 40.0},
            {"text": "Position sizing", "votes": 4, "percentage": 20.0},
            {"text": "Volatility based", "votes": 3, "percentage": 15.0}
        ],
        "user_vote": 1
    }
}
```

### Comment Endpoints

#### POST /api/comments
```json
// Request
{
    "content": "Great question! I recommend starting with paper trading...",
    "parent_type": "query",
    "parent_id": 1,
    "parent_comment_id": null
}

// Response
{
    "success": true,
    "data": {
        "comment": {
            "id": 123,
            "content": "Great question! I recommend starting with paper trading...",
            "author": {
                "id": 1,
                "display_name": "CurrentUser",
                "avatar_url": null
            },
            "parent_type": "query",
            "parent_id": 1,
            "parent_comment_id": null,
            "likes_count": 0,
            "is_liked": false,
            "created_at": "2024-01-15T13:15:00Z"
        }
    }
}
```

### Like Endpoints

#### POST /api/likes
```json
// Request
{
    "target_type": "query",
    "target_id": 1
}

// Response
{
    "success": true,
    "data": {
        "liked": true,
        "likes_count": 46
    }
}
```

#### DELETE /api/likes
```json
// Request: DELETE /api/likes?target_type=query&target_id=1

// Response
{
    "success": true,
    "data": {
        "liked": false,
        "likes_count": 45
    }
}
```

### Category & Tag Endpoints

#### GET /api/categories
```json
// Response
{
    "success": true,
    "data": {
        "categories": [
            {
                "id": 1,
                "name": "Beginner",
                "slug": "beginner",
                "description": "Getting started with trading",
                "color": "green"
            },
            {
                "id": 2,
                "name": "Trading Strategies",
                "slug": "trading-strategies",
                "description": "Share and discuss trading strategies",
                "color": "blue"
            }
        ]
    }
}
```

#### GET /api/tags
```json
// Response
{
    "success": true,
    "data": {
        "tags": [
            {
                "id": 1,
                "name": "technical-analysis",
                "slug": "technical-analysis",
                "usage_count": 45
            },
            {
                "id": 2,
                "name": "risk-management",
                "slug": "risk-management",
                "usage_count": 38
            }
        ]
    }
}
```

## Technology Stack Recommendations

### Backend Framework
- **Node.js + Express.js** or **Python + FastAPI**
- **TypeScript** for type safety
- **Prisma** or **TypeORM** for database ORM
- **JWT** for authentication
- **Multer** for file uploads
- **Joi** or **Zod** for validation

### Database
- **PostgreSQL** (recommended) or **MySQL**
- **Redis** for caching and sessions
- **Elasticsearch** for advanced search (optional)

### File Storage
- **AWS S3** or **Cloudinary** for images/videos
- **CDN** for static assets

### Additional Features
- **Rate limiting** with express-rate-limit
- **Logging** with Winston
- **Monitoring** with Sentry
- **Email service** with SendGrid or Nodemailer
- **Image optimization** with Sharp
- **Full-text search** with database capabilities

## Security Considerations

1. **Input validation** on all endpoints
2. **SQL injection prevention** with parameterized queries
3. **XSS protection** with content sanitization
4. **Rate limiting** to prevent abuse
5. **CORS configuration** for cross-origin requests
6. **Authentication middleware** for protected routes
7. **File upload restrictions** (size, type, validation)
8. **Environment variables** for sensitive data

## Performance Optimizations

1. **Database indexing** on frequently queried fields
2. **Pagination** for large datasets
3. **Caching** with Redis for frequently accessed data
4. **Lazy loading** for comments and replies
5. **Image optimization** and CDN usage
6. **Database connection pooling**
7. **Query optimization** with proper joins and selects

This specification provides a comprehensive foundation for building a robust backend system for the Query, Article, and Discussion features.
