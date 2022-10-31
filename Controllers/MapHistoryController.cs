using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Next_core_blog.Controllers
{
    [Route("api/MapHistory")]
    public class IpHistoryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IpHistoryController> _logger;
    }
}