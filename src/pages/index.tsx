import { Box, Flex, Stack, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import useInView from "react-cool-inview";

import type { Project, ProjectItf } from "../../data/ecosystem";
import { allProjects } from "../../data/ecosystem";
import { allStatusTags, getStatus, Status } from "../../data/status-tag";
import type { Tag } from "../../data/tag";
import { allTags } from "../../data/tag";
import CardProject from "../components/card/CardProject";
import TagMenu from "../components/layout/TagMenu";
import { useTranslate } from "../context/TranslateProvider";

const Home: NextPage = () => {
  const { t } = useTranslate();
  const LOADED_STEPS = 10;
  const tagAll = allTags[0];
  const [flippedIndex, setFlippedIndex] = useState(-1);
  const [tagsFilter, setTagsFilter] = useState(tagAll);
  const [statusFilter, setStatusFilter] = useState(Status.ALL);
  const [projects, setProjects] = useState<ProjectItf[]>([]);
  const [lastIndexLoaded, setLastIndexLoaded] = useState<number>(LOADED_STEPS);

  useEffect(() => {
    const newProjects = allProjects
      // Filter projects by tags
      .filter((project: Project) => {
        return (
          tagsFilter === tagAll || project.tags.indexOf(tagsFilter.value) !== -1
        );
      })
      // Filter projects by status (all | live | testnet)
      .filter((project: Project) => {
        return (
          statusFilter === Status.ALL ||
          (project.isLive && statusFilter === Status.LIVE) ||
          // We don't want here projects in testnet && live
          (!project.isLive &&
            project.isTestnetLive &&
            statusFilter === Status.TESTNET)
        );
      })
      // Sort projects a-z
      .sort((project1, project2) =>
        project1.name.toLowerCase().localeCompare(project2.name.toLowerCase())
      )
      // Lazy loading
      .slice(0, lastIndexLoaded)
      // Map tag object
      .map((project) => {
        const projectTags = project.tags;
        return {
          ...project,
          tagsRef: allTags.filter((tagItem: Tag) => {
            return projectTags.includes(tagItem.value);
          }),
        };
      });
    setProjects(newProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsFilter, statusFilter, lastIndexLoaded]);

  const { observe } = useInView({
    // When the last item comes to the viewport
    onEnter: ({ unobserve }) => {
      // Pause observe when loading data
      unobserve();
      setLastIndexLoaded(lastIndexLoaded + LOADED_STEPS);
    },
  });

  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="center"
      px={[4, 0]}
      transform="translateZ(0)"
    >
      {/* Big intro text */}
      <Text
        mt={12}
        textAlign="center"
        lineHeight={1.2}
        fontSize={["48px", "68px"]}
        fontWeight="bold"
        maxWidth="850px"
      >
        {t.common.title_main}
      </Text>
      {/* Sub intro text */}
      <Text
        mt={8}
        textAlign="center"
        color="whiteAlpha.600"
        fontSize="24px"
        maxWidth="400px"
      >
        {t.common.subtitle_main}
      </Text>
      <Text
        mt={4}
        textAlign="center"
        color="whiteAlpha.600"
        fontSize="18px"
        maxWidth="400px"
      >
        {t.common.community_driven}
      </Text>
      {/* Main part */}
      <Flex w="full" direction="column" mt={8}>
      <Flex w="full" direction="row" justify="space-between" align="flex-start">
        <Flex flex={2} justify="flex-start" align="center">
          <Text fontWeight="bold" textAlign="center" fontSize="24px">
            Category
          </Text>
          <TagMenu
              initialValue={allTags[0]}
              tags={allTags}
              onChange={(newFilter) => {
                setTagsFilter(newFilter);
                // Reset lazy loading index
                setLastIndexLoaded(LOADED_STEPS);
                // Reset flipped cards to none
                setFlippedIndex(-1);
              }}
          />
        </Flex>
        <Flex flex={1} justify="flex-end">
          <Text fontWeight="bold" textAlign="center" fontSize="24px">
            Checkbox
          </Text>
        </Flex>
      </Flex>

        {/*<TagMenu
          initialValue={allStatusTags[0]}
          tags={allStatusTags}
          onChange={(newFilter) => {
            setStatusFilter(getStatus(newFilter.value));
            // Reset lazy loading index
            setLastIndexLoaded(LOADED_STEPS);
            // Reset flipped cards to none
            setFlippedIndex(-1);
          }}
        />*/}
        <Stack
          mt={10}
          direction="row"
          justify="center"
          spacing={0}
          wrap="wrap"
          shouldWrapChildren
        >
          {projects && projects.length > 0 ? (
            projects.map((project: ProjectItf, index: number) => {
              return (
                <Box
                  ref={index === projects.length - 1 ? observe : null}
                  key={`project-${project.name}`}
                  py={4}
                  px={4}
                  width="300px"
                >
                  <CardProject
                    project={project}
                    isFlipped={flippedIndex === index}
                    onClick={() => setFlippedIndex(index)}
                  />
                </Box>
              );
            })
          ) : (
            <Flex my={8} direction="column" align="center" opacity=".8">
              <Text fontSize="24px">{t.common.no_project}</Text>
              <Text mt={2} fontSize="18px">
                {t.common.maybe_yours}
              </Text>
            </Flex>
          )}
        </Stack>
      </Flex>
    </Flex>
  );
};

export default Home;
