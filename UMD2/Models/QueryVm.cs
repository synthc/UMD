﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class QueryVm
    {
        public string UserName { get; set; }
        public string SearchFor { get; set; }
        public string SearchBy { get; set; }
        public string Query { get; set; }
        public List<Media> Results { get; set; }
    }
}