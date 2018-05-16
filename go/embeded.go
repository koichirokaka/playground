package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

var yaml string

func init() {
	name := os.Args[1]
	viper.SetConfigFile("viper.yaml")
	viper.SetConfigType("yaml")
	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}
	base := "test"
	dir := filepath.Join("template", base)
	fns := viper.GetStringSlice("embeded." + base)
	embeded := make(map[string]bool)
	for _, fn := range fns {
		embeded[filepath.Join(dir, fn)] = true
	}
	if err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		fd, err := os.Open(path)
		if err != nil {
			return err
		}
		if stat, err := fd.Stat(); err != nil {
			return err
		} else if stat.IsDir() {
			dirs = append(dirs, path)
		} else {
			b, err := ioutil.ReadAll(fd)
			if err != nil {
				return err
			}
			if embeded[path] {
				files[path] = fmt.Sprintf(string(b), name)
			} else {
				files[path] = string(b)
			}
		}
		return nil
	}); err != nil {
		panic(err)
	}
}

var (
	files = make(map[string]string)
	dirs  []string
)

func main() {
	fmt.Println("dirs: ", dirs)
	fmt.Println("files: ", files)
}
