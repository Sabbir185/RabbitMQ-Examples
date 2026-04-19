package main

func main() {
	go orderQueue()
	go notificationQueue()

	select {}
}
