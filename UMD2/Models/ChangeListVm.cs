using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class ChangeListVm
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int MediaId { get; set; }
        public string Mode { get; set; }
        public string ListName { get; set; }
    }
}