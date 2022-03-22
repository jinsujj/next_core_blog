using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.BlogNote
{
    public class SubCategory
    {
        public int SubCategoryId {get;set;}
        public int CategoryId {get;set;}
        public string Name {get;set;}
        public int Count {get;set;}
    }
}