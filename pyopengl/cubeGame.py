"""
Main loop for a simple 3d game
"""

from Shapes import *
from basics import *

import pygame
from pygame.locals import *

from OpenGL.GL import *
from OpenGL.GLU import *

import numpy as np
from numpy import pi, sin, cos, sqrt

import random
from random import random as rand
from pdb import set_trace as tr


def main():
    pygame.init()
    # pygame.font.init()
    # myfont = pygame.font.SysFont('Comic Sans MS', 30)
    display = (1200,800)
    gameDisplay = pygame.display.set_mode(display, DOUBLEBUF|OPENGL)

    gluPerspective(45, (display[0]/display[1]), 1.0, 30.0)
    glClearColor(rand(),rand(),rand(),rand())
    glTranslatef(0,0,-20.0)

    ground = Ground()

    obstacles = [Cube((0,0,0))]
    for i in range(0, random.randint(1,10)):
        obstacles.append(Asteroid(((rand()-0.5)*10,(rand()-0.5)*10,(rand()-0.5)*10), size=rand()))

    done = 10

    while done > 0:
        keys = pygame.key.get_pressed()  #checking pressed keys
        
        if keys[pygame.K_a]:
            glRotatef(5, 0, 1, 0)
        if keys[pygame.K_d]:
            glRotatef(5, 0, -1, 0)

        if keys[pygame.K_w]:
            glRotatef(5, 0, 0, 1)
        if keys[pygame.K_s]:
            glRotatef(5, 0, 0, -1)

        # if keys[pygame.K_g]:
        #     glRotatef(5, 1, 0, 0)
        # if keys[pygame.K_h]:
        #     glRotatef(5, -1, 0, 0)

        if keys[pygame.K_LEFT]:
            glTranslatef(0.1,0,0)
        if keys[pygame.K_RIGHT]:
            glTranslatef(-0.1,0,0)

        if keys[pygame.K_UP]:
            glTranslatef(0,-0.1,0)
        if keys[pygame.K_DOWN]:
            glTranslatef(0,0.1,0)

        # if keys[pygame.K_c]:
        #     glTranslatef(0,0,0.1)
        # if keys[pygame.K_z]:
        #     glTranslatef(0,0,-0.1)


        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key==pygame.K_q:
                    pygame.quit()
                    quit()
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()

        glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT)
        
        ground.draw()
        for obstacle in obstacles:
            obstacle.draw()

        glTranslatef(0,0,0.3)


        x = glGetDoublev(GL_MODELVIEW_MATRIX)

        camera_x = x[3][0]
        camera_y = x[3][1]
        camera_z = x[3][2]

        camera_pos = (camera_x, camera_y, camera_z)

        for obstacle in obstacles:
            if obstacle.hit_person(camera_pos):
                print("DIE DIE DIE DIE")
                pygame.mixer.music.load('death.mp3')
                pygame.mixer.music.play(0)

        if camera_z < 2:
            done-=1
            glClearColor(rand(),rand(),rand(),rand())
            glTranslatef(0,0,-20.0)
            for obstacle in obstacles:
                obstacle.scramble_pos(10)

        pygame.display.flip()
        pygame.time.wait(10)


if __name__ == "__main__":
    main()

