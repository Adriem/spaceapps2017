using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelegramBot
{
    class Acronym
    {
        [JsonProperty(PropertyName = "def_id")]
        public string def_id;

        [JsonProperty(PropertyName = "acronym")]
        public string acronym;

        [JsonProperty(PropertyName = "word")]
        public string[] word;

        [JsonProperty(PropertyName = "text")]
        public string text;

        [JsonProperty(PropertyName = "positive_vote")]
        public int positive_vote;

        [JsonProperty(PropertyName = "negative_vote")]
        public int negative_vote;
    }
}
