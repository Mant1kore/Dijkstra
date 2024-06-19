using System;
using System.Collections.Generic;
using DijkstraApi.Models;

namespace DijkstraApi.Services
{
    public class DijkstraService
    {
        public Dictionary<string, object> CalculateShortestPath(Graph graph, string startNode)
        {
            var distances = new Dictionary<string, int>();
            var previousNodes = new Dictionary<string, string?>();
            var nodes = new List<string>();

            foreach (var node in graph.Nodes.Keys)
            {
                distances[node] = int.MaxValue;
                previousNodes[node] = null;
                nodes.Add(node);
            }

            distances[startNode] = 0;

            while (nodes.Count != 0)
            {
                nodes.Sort((x, y) => distances[x].CompareTo(distances[y]));

                var smallest = nodes[0];
                nodes.Remove(smallest);

                if (distances[smallest] == int.MaxValue)
                {
                    break;
                }

                foreach (var neighbor in graph.Nodes[smallest])
                {
                    var alt = distances[smallest] + neighbor.Value;
                    if (alt < distances[neighbor.Key])
                    {
                        distances[neighbor.Key] = alt;
                        previousNodes[neighbor.Key] = smallest;
                    }
                }
            }

            var result = new Dictionary<string, object>();
            foreach (var kvp in distances)
            {
                result[kvp.Key] = kvp.Value == int.MaxValue ? "Infinity" : kvp.Value;
            }

            return result;
        }
    }
}
