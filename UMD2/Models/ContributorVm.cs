using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class ContributorVm
    {
        public int Id { get; set; }
        public int MediaId { get; set; }
        public int ContributorId { get; set; }
        public Contributor Contributor { get; set; }
    }
}