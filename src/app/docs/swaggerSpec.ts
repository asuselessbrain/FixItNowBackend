export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "FixItNow API",
    version: "1.0.0",
    description: "Interactive Swagger API documentation for the FixItNow Home Services Marketplace",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API Version 1 Base URL"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT Access Token to access secure endpoints"
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Log in user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "customer@gmail.com" },
                  password: { type: "string", example: "123456" }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          200: { description: "Successful login, returns cookies and response body" }
        }
      }
    },
    "/auth/refresh-token": {
      get: {
        tags: ["Authentication"],
        summary: "Generate new access token using refresh token cookie",
        responses: {
          200: { description: "New access token generated successfully" }
        }
      }
    },
    "/auth/forget-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request a password reset link to be sent to email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "customer@gmail.com" }
                },
                required: ["email"]
              }
            }
          }
        },
        responses: {
          200: { description: "Password reset link sent to your email" }
        }
      }
    },
    "/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password with reset token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string", description: "JWT reset token from email link" },
                  newPassword: { type: "string", example: "newpassword123" }
                },
                required: ["token", "newPassword"]
              }
            }
          }
        },
        responses: {
          200: { description: "Password reset successfully" }
        }
      }
    },
    "/auth/change-password": {
      post: {
        tags: ["Authentication"],
        summary: "Change password (Authenticated users)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  oldPassword: { type: "string", example: "123456" },
                  newPassword: { type: "string", example: "newpassword123" }
                },
                required: ["oldPassword", "newPassword"]
              }
            }
          }
        },
        responses: {
          200: { description: "Password changed successfully" }
        }
      }
    },
    "/auth/update-profile": {
      patch: {
        tags: ["Authentication"],
        summary: "Update personal profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  phone: { type: "string", example: "+8801700000000" },
                  avatar: { type: "string", example: "https://api.yourdomain.com/avatar.png" },
                  address: { type: "string", example: "Dhaka, Bangladesh" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Profile updated successfully" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current logged-in user profile",
        responses: {
          200: { description: "User details retrieved successfully" }
        }
      }
    },
    "/user": {
      post: {
        tags: ["Users"],
        summary: "Register new user (Customer or Technician)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "arfan@gmail.com" },
                  name: { type: "string", example: "Arfan" },
                  password: { type: "string", example: "123456" },
                  phone: { type: "string", example: "+8801812345678" },
                  role: { type: "string", enum: ["customer", "technician"], example: "customer" },
                  avatar: { type: "string", example: "https://api.yourdomain.com/avatar.png" },
                  address: { type: "string", example: "Dhaka, Bangladesh" }
                },
                required: ["email", "name", "password", "phone"]
              }
            }
          }
        },
        responses: {
          201: { description: "User created successfully" }
        }
      },
      get: {
        tags: ["Users"],
        summary: "Get all users (Admin only)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "searchTerm", in: "query", schema: { type: "string" } },
          { name: "role", in: "query", schema: { type: "string", enum: ["customer", "technician", "admin"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "banned"] } }
        ],
        responses: {
          200: { description: "List of users retrieved" }
        }
      }
    },
    "/user/{userId}/status": {
      patch: {
        tags: ["Users"],
        summary: "Update user status (Admin only)",
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["active", "banned"], example: "banned" }
                },
                required: ["status"]
              }
            }
          }
        },
        responses: {
          200: { description: "User status updated successfully" }
        }
      }
    },
    "/categories": {
      post: {
        tags: ["Categories"],
        summary: "Create a new category (Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Plumbing" },
                  slug: { type: "string", example: "plumbing" },
                  description: { type: "string", example: "All plumbing services" },
                  image_url: { type: "string", example: "https://api.yourdomain.com/plumbing.png" }
                },
                required: ["name", "slug"]
              }
            }
          }
        },
        responses: {
          201: { description: "Category created successfully" }
        }
      },
      get: {
        tags: ["Categories"],
        summary: "Get all active categories",
        responses: {
          200: { description: "List of categories" }
        }
      }
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get single category details",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Category retrieved successfully" }
        }
      },
      patch: {
        tags: ["Categories"],
        summary: "Update category details (Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Plumbing Services" },
                  slug: { type: "string", example: "plumbing-services" },
                  description: { type: "string", example: "Updated description" },
                  image_url: { type: "string", example: "https://api.yourdomain.com/plumbing-updated.png" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Category updated successfully" }
        }
      }
    },
    "/categories/{id}/toggle-status": {
      patch: {
        tags: ["Categories"],
        summary: "Toggle category active status (Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Category status toggled successfully" }
        }
      }
    },
    "/technician": {
      get: {
        tags: ["Technicians"],
        summary: "Get all active technician profiles",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "searchTerm", in: "query", schema: { type: "string" } }
        ],
        responses: {
          200: { description: "List of technicians" }
        }
      },
      patch: {
        tags: ["Technicians"],
        summary: "Update technician professional profile (Technician only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Technician Name" },
                  phone: { type: "string", example: "+8801700000000" },
                  avatar: { type: "string", example: "https://api.yourdomain.com/avatar.png" },
                  address: { type: "string", example: "Dhaka, Bangladesh" },
                  technicianProfiles: {
                    type: "object",
                    properties: {
                      bio: { type: "string", example: "Expert plumber with 5 years experience" },
                      experience_year: { type: "integer", example: 5 },
                      location: { type: "string", example: "Dhaka" },
                      skills: { type: "string", example: "Plumbing, Leakage Fix" },
                      isAvailable: { type: "boolean", default: true }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Technician profile updated successfully" }
        }
      }
    },
    "/technician/generate-time-slots": {
      get: {
        tags: ["Technicians"],
        summary: "Generate preset hourly time slots (Technician only)",
        responses: {
          200: { description: "Preset time slots array generated successfully" }
        }
      }
    },
    "/technician/{id}": {
      get: {
        tags: ["Technicians"],
        summary: "Get single technician details by user ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Technician profile retrieved" }
        }
      }
    },
    "/services": {
      post: {
        tags: ["Services"],
        summary: "Create a new service (Technician only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Water Basin Repair" },
                  price: { type: "number", example: 450.00 },
                  location: { type: "string", example: "Dhaka" },
                  categoryId: { type: "string", format: "uuid", example: "category-uuid-here" },
                  description: { type: "string", example: "Fix leakage in water basin" },
                  image_url: { type: "string", example: "https://api.yourdomain.com/service.png" }
                },
                required: ["name", "price", "location", "categoryId"]
              }
            }
          }
        },
        responses: {
          201: { description: "Service created successfully" }
        }
      },
      get: {
        tags: ["Services"],
        summary: "Get all active services",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "searchTerm", in: "query", schema: { type: "string" } },
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "category.name", in: "query", schema: { type: "string" } }
        ],
        responses: {
          200: { description: "List of services" }
        }
      }
    },
    "/services/my-added-services": {
      get: {
        tags: ["Services"],
        summary: "Get services added by the logged-in technician",
        responses: {
          200: { description: "List of services added by this technician" }
        }
      }
    },
    "/services/{id}": {
      get: {
        tags: ["Services"],
        summary: "Get single service details by service ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Service details retrieved" }
        }
      },
      patch: {
        tags: ["Services"],
        summary: "Update service details (Technician only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Updated basin repair" },
                  price: { type: "number", example: 500.00 },
                  location: { type: "string", example: "Dhaka" },
                  categoryId: { type: "string", format: "uuid" },
                  description: { type: "string", example: "Updated description" },
                  image_url: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Service updated successfully" }
        }
      }
    },
    "/technician-time-slot": {
      post: {
        tags: ["Availability Slots"],
        summary: "Create daily availability time slots (Technician only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  date: { type: "string", format: "date", example: "2026-07-20" },
                  selectedSlots: {
                    type: "array",
                    items: { type: "string" },
                    example: ["9:00 AM to 10:00 AM", "10:00 AM to 11:00 AM"]
                  }
                },
                required: ["date", "selectedSlots"]
              }
            }
          }
        },
        responses: {
          201: { description: "Time slots created successfully" }
        }
      },
      put: {
        tags: ["Availability Slots"],
        summary: "Update/replace daily availability time slots (Technician only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  date: { type: "string", format: "date", example: "2026-07-20" },
                  selectedSlots: {
                    type: "array",
                    items: { type: "string" },
                    example: ["9:00 AM to 10:00 AM", "11:00 AM to 12:00 PM"]
                  }
                },
                required: ["date", "selectedSlots"]
              }
            }
          }
        },
        responses: {
          200: { description: "Time slots updated successfully" }
        }
      }
    },
    "/booking": {
      post: {
        tags: ["Bookings"],
        summary: "Create service booking request (Customer only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  serviceId: { type: "string", format: "uuid", example: "service-uuid-here" },
                  slotId: { type: "string", format: "uuid", example: "slot-uuid-here" }
                },
                required: ["serviceId", "slotId"]
              }
            }
          }
        },
        responses: {
          201: { description: "Booking request created successfully" }
        }
      },
      get: {
        tags: ["Bookings"],
        summary: "Get all system bookings (Admin only)",
        responses: {
          200: { description: "List of all bookings" }
        }
      }
    },
    "/booking/my-bookings": {
      get: {
        tags: ["Bookings"],
        summary: "Get current customer's booking history",
        responses: {
          200: { description: "List of customer bookings" }
        }
      }
    },
    "/booking/technician-bookings": {
      get: {
        tags: ["Bookings"],
        summary: "Get incoming technician jobs",
        responses: {
          200: { description: "List of technician jobs" }
        }
      }
    },
    "/booking/{bookingId}": {
      get: {
        tags: ["Bookings"],
        summary: "Get single booking details",
        parameters: [
          { name: "bookingId", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Booking details" }
        }
      }
    },
    "/booking/{bookingId}/accept": {
      patch: {
        tags: ["Bookings"],
        summary: "Accept booking (Technician only)",
        parameters: [
          { name: "bookingId", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Booking accepted (CONFIRMED)" }
        }
      }
    },
    "/booking/{bookingId}/reject": {
      patch: {
        tags: ["Bookings"],
        summary: "Reject booking (Technician only)",
        parameters: [
          { name: "bookingId", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Booking rejected (REJECTED)" }
        }
      }
    },
    "/booking/{bookingId}/in-progress": {
      patch: {
        tags: ["Bookings"],
        summary: "Set job to in progress (Technician only)",
        parameters: [
          { name: "bookingId", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Booking in progress (IN_PROGRESS)" }
        }
      }
    },
    "/booking/{bookingId}/complete": {
      patch: {
        tags: ["Bookings"],
        summary: "Complete job (Technician only)",
        parameters: [
          { name: "bookingId", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Booking completed (COMPLETED)" }
        }
      }
    },
    "/booking/{bookingId}/cancel-by-technician": {
      patch: {
        tags: ["Bookings"],
        summary: "Cancel job request (Technician only)",
        parameters: [
          { name: "bookingId", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Booking cancelled by technician" }
        }
      }
    },
    "/booking/{bookingId}/cancel-by-customer": {
      patch: {
        tags: ["Bookings"],
        summary: "Cancel job request (Customer only)",
        parameters: [
          { name: "bookingId", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          200: { description: "Booking cancelled by customer" }
        }
      }
    },
    "/payment/checkout-session": {
      post: {
        tags: ["Payments"],
        summary: "Create a checkout session via Stripe (Customer only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bookingId: { type: "string", format: "uuid", example: "booking-uuid-here" }
                },
                required: ["bookingId"]
              }
            }
          }
        },
        responses: {
          201: { description: "Stripe checkout session url generated successfully" }
        }
      }
    },
    "/payment/history": {
      get: {
        tags: ["Payments"],
        summary: "Retrieve customer payment history",
        responses: {
          200: { description: "Payment history list retrieved successfully" }
        }
      }
    },
    "/payment/{paymentId}": {
      get: {
        tags: ["Payments"],
        summary: "Get details of a single payment by ID",
        parameters: [
          { name: "paymentId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Payment details" }
        }
      }
    },
    "/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Submit review and rating for completed job (Customer only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bookingId: { type: "string", format: "uuid", example: "booking-uuid-here" },
                  rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                  comment: { type: "string", example: "Awesome services, very professional!" }
                },
                required: ["bookingId", "rating"]
              }
            }
          }
        },
        responses: {
          201: { description: "Review submitted successfully" }
        }
      }
    }
  }
};
