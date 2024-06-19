using Microsoft.AspNetCore.Mvc;
using DijkstraApi.Models;
using DijkstraApi.Services;

namespace DijkstraApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DijkstraController : ControllerBase
    {
        private readonly DijkstraService _dijkstraService;

        public DijkstraController(DijkstraService dijkstraService)
        {
            _dijkstraService = dijkstraService;
        }

        [HttpPost]
        [Route("calculate")]
        public IActionResult CalculateShortestPath([FromBody] Graph graph, [FromQuery] string startNode)
        {
            var result = _dijkstraService.CalculateShortestPath(graph, startNode);
            return Ok(result);
        }
    }
}
