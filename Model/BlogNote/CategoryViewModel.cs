using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.BlogNote
{
    public class CategoryViewModel
    {
        public int userId { get; set; }
        public string category { get; set; }
        public string subCategory { get; set; }
    }
}