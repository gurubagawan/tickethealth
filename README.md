Simple app for submitting form sumbmissions. 

To run the app: 
- navigate to the ticket-health and run `yarn install`
- navigate to ticket-backend and run `bundle install`
    - run `bundle exec rake db:migrate` 

If you want to run with one command  
- navigate to the root directory and install foreman `gem install foreman`
- run with `foreman start`
- go to `http://localhost:5100` to interact with app


OR:
- navigate to ticket-backend and run  `bin/rails server -p 3000`
- navigate to the ticket-health and run `yarn dev`
- go to 'http://localhost:3001/` to interact with app 


To run tests
- navigate into ticket-health and run `yarn test` 
- navigate into ticket-backend and run `rspec` 


HIPAA compliance: 
User submissions are stored with a hashed value for email. By keeping this value as a hash, it ensures that any data leaks won't be able to be traced back to intial submission.