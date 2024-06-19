using System.Collections.Generic;

namespace DijkstraApi.Models
{
    public class Graph
    {
        public Dictionary<string, Dictionary<string, int>> Nodes { get; set; } = new Dictionary<string, Dictionary<string, int>>();

        public void AddNode(string name)
        {
            Nodes[name] = new Dictionary<string, int>();
        }

        public void AddEdge(string fromNode, string toNode, int weight)
        {
            Nodes[fromNode][toNode] = weight;
        }
    }
}
