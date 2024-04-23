# carbon-footprint-calculator

Welcome to my Carbon Footprint calculator!
This is a fullstack application. The repository consists in both a graphQL API (`/carbon-calculator-api`) and a React frontent (`/carbon-calculator-front`)
The purpose of the application is to present a calculator frontend which, based on several parameters, will calculate your houlsehold CO2 emissions. 
While implementing, I have tryed my best to research and use data as accurate as possible. 

Much of the inspiration for this calculator came from this live EPA Carbon Footprint Calculator => https://www3.epa.gov/carbon-footprint-calculator/

## carbon-calculator-api 

GraphQL API with all the calculations logic
Currently not storing any data on purpose (besides some memory storage for simulate a data repository)
Start with `npm run start`
Test with `npm run test`

### Architecture

# Project Architecture

This project tried to follow concepts of Clean Architecture, separating responsibilities by domain. One improvement that could have been done would be to 
separate graphQL business rules from domain business rules, but I prefer to focus on other aspects during this excercise. 

The project is structured into various layers to encapsulate specific responsibilities:

## `src/` - Source Code Layer
- `enums/` - Enumerations defining constant values.
- `graphql/` - GraphQL schema and resolver definitions, segregated by domain:
  - `carbonFootprint/` - Carbon footprint calculation domain and other overall implementations like initial parameters configurations
  - `homeEnergy/` - Home energy usage domain.
  - `transportation/` - Transportation-related calculations.
  - `waste/` - Waste management and recycling computations.
- `infrastructure/` - Infrastructure setup for databases and external services. There is no "real" database here, everything is stored in memory. It is just to showcase that if I would need a database or external client for this project, following the clean architecture principles, they would be placed here
  - `repository/` - Data access layer for CRUD operations. Not sending to any databases for now
  - `client/` - Mock API client simulating fecthing live carbon emission data
- `utils/` - Utility functions shared across the application.

## `test/` - Testing Layer
- `integration/` - Integration tests to validate combined parts of the application.
- `mocks/` - Mock data for simulating behavior in tests.
- `unit/` - Unit tests for verifying the smallest testable parts of the application.

### TODOs
- Add more unit testings overall, with more edge cases
- Add more integration tests for the carbon footprint domain
- Try to look for a live API for the emission factors

## carbon-calculator-front 

React frontend - API must be running to work
Start with `npm run start`

### TODOs
- Create more frontend automated tests
- Track progress for each calculation step
- Properly handle minor errors as the calculation parameters are filled 

## Final remarks 

This is just a V1, which main purpose is to illustrate the reasoning behind the application's development

