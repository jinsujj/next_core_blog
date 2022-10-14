using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.BlogNote
{
    public class SidebarCategoryViewModel
    {
        public string name { get; set; }
        public int mainCount { get; set; }
        public string subName { get; set; }
        public int subCount { get; set; }
    }
}