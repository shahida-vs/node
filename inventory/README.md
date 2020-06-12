i have met the basic requirements, but i wanted to add some basic features , which i couldn't due to time limitation
they are:
updating item
item should be displayed with count in category(for now they are duplicated)


Category Table:
first we need to add category in the Category table
category model : 
       name: String,
       itemCount: { type: Number, default: 0 },
       items: [String],
       categoryId: String
while adding/creating category we have to pass only name of the category and id for it
itemCount and items are updated automatically when item is added or removed from item table

we can fetch see details of a category by category id - endpoint(/inventory/categories/<categoryId>)
we can fetch all the categories - endpoint(/inventory/categories)






Note : we can not add item without adding category into category table
