using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Next_Core_Blog.Controllers
{
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<NoteController> _logger;
    }
}