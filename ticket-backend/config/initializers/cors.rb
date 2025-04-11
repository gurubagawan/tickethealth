Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # Or replace with 'http://localhost:3001' for stricter security

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :options],
      credentials: false
  end
end
