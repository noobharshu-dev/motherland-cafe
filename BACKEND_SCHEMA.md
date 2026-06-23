# Database Schema

## Reservation
- id
- name
- phone
- email
- guests
- reservationDate
- reservationTime
- notes
- status
- createdAt

## Review
- id
- name
- rating
- reviewText
- source

## GalleryImage
- id
- imageUrl
- title
- category

## MenuCategory
- id
- name
- displayOrder

## MenuItem
- id
- categoryId
- name
- description
- price
- imageUrl
- isVegetarian
- isVegan
- isGlutenFree
- isFeatured
