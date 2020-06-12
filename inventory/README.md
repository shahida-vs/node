
Category Table:
category model : 
       name: String, // name of category eg Redmi
       itemCount: { type: Number, default: 0 }, // total no of items in category Samsung
       items: [{itemCount:Number,itemName:String}], //itemCount gives the no of particular item
       categoryId: String //custom id eg Rd1
NOTE - while adding/creating category we have to pass only name of the category and categoryId for it,otherwise error will 
       be thrown.
       categoryId have to be unique.
       itemCount and items are updated automatically in category table when item is added or removed from item table

we can fetch see details of a category by categoryId - endpoint(/inventory/categories/<categoryId>)
we can fetch all the categories - endpoint(/inventory/categories)
we can create a category - endpoint(/inventory/categories)
we can update only category name of a category by categoryId - endpoint(/inventory/categories/<categoryId>)

Document from collection categories
{
    "_id" : ObjectId("5ee3839f5659f41442bc7de7"),
    "itemCount" : 4,
    "items" : [ 
        {
            "itemName" : "Note 5",
            "itemCount" : 1
        },
        {
            "itemName" : "Note 8",
            "itemCount" : 3
        }
    ],
    "name" : "Redmi",
    "categoryId" : "Rd1",
    "__v" : 0
}








Item Table:
item model :
    name: String,//name of the item eg Note 5
    author: String,//person who added item to the table
    categoryId: String,//id of the category to which the item belongs to
    price: Number//price of the item
NOTE : we can not add item without adding category for it in category table,otherwise error will be thrown
       We need to pass all the 4 fields
       On Addition/removal of item , category table and log table are updated
       _id is treated as model no. so we can have same named items.

We can fetch all items - endpoint(/inventory/items)
We can fetch a particular item by item id - endpoint(/inventory/items/<_id>)
we can create an item - endpoint(/inventory/items)
we can delete an item by item id - endpoint(/inventory/items/<_id>)


Document from collection items
{
    "_id" : ObjectId("5ee38606cd62d6146b6b774d"),
    "name" : "Note 5",
    "author" : "Saara",
    "price" : 7000,
    "categoryId" : "Rd1",
    "__v" : 0
}








Log Table:
log model :
    categoryId: String, //the category to which item belongs
    date: { type: Date, default: Date.now },//time when log is created(i.e., addition or removal time of an item)
    item: String,//name of the item
    operation: String,//it is either "Added" or "Removed"
    author: String,//person who added the item to db
    price: Number,//price of the item being added or deleted
    itemId: Object(String)//_id of the item
NOTE : We can not create or modify a log since it should automatically happen whenever item is added or removed there is
     no point in adding or updating it.
We can fetch all logs - endpoint(/inventory/logs)
we can fetch a log with log id - endpoint(/inventory/logs/<_id>) //here <_id> is log's unique id
we can fetch a log with item id - endpoint(/inventory/logs/item/<_id>) // here <_id> is item's unique id. This would 
       result in all the logs of a particular item .Thus, we would be able to know when item was added and when it was removed
we can delete a log using log id - endpoint(/inventory/logs/<_id>)

Document from collection logs
{
    "_id" : ObjectId("5ee38606cd62d6146b6b774e"),
    "author" : "Saara",
    "price" : 7000,
    "categoryId" : "Rd1",
    "operation" : "Added",
    "itemId" : "5ee38606cd62d6146b6b774d",
    "item" : "Note 5",
    "date" : ISODate("2020-06-12T13:41:26.251Z"),
    "__v" : 0
}







what more could be added :
  Delete a category if no item exists corresponding to it in item table
  Update an item - make required changes in category table of removing it from a particular category and adding it to the
                   new one(if categoryId is to be updated).Log table will also have new operation value as "Modified"
  Delete a log by item id - since we might want to untrack all logs of a particular item

