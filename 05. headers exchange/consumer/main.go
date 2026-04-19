package main

func main() {
	go errorQueue()
	go warningQueue()
	go anyQueue()

	select {}
}
