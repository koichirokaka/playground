package main

import (
	"context"
	"encoding/base64"
	"flag"
	"fmt"
	"log"

	"golang.org/x/oauth2/google"

	"google.golang.org/api/pubsub/v1"
)

var (
	project = flag.String("project", "", "gcp project id")
	topic   = flag.String("topic", "", "cloud pub/sub topic name")
)

func main() {
	flag.Parse()
	ctx := context.TODO()
	// Please login gcp as application default.
	// If not, you are not authorized.
	c, err := google.DefaultClient(ctx, pubsub.PubsubScope)
	if err != nil {
		log.Fatal(err)
	}

	srv, err := pubsub.New(c)
	if err != nil {
		log.Fatal(err)
	}

	tn := fmt.Sprintf("projects/%s/topics/%s", *project, *topic)
	req := &pubsub.PublishRequest{
		Messages: []*pubsub.PubsubMessage{
			&pubsub.PubsubMessage{
				Data: base64.StdEncoding.EncodeToString([]byte("Hello, World")),
			},
		},
	}

	res, err := srv.Projects.Topics.Publish(tn, req).Do()
	if err != nil {
		log.Fatal(err)
	} else if res.HTTPStatusCode >= 400 {
		log.Fatal(fmt.Printf("status code is %d", res.HTTPStatusCode))
	}

	fmt.Println("Message id is: ", res.MessageIds)
}
