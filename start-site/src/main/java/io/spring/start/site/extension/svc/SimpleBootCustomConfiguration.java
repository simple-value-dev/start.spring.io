/*
 * Copyright 2012-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.spring.start.site.extension.svc;

import io.spring.initializr.generator.project.ProjectGenerationConfiguration;
import io.spring.initializr.generator.project.contributor.ProjectContributor;
import io.spring.start.site.extension.svc.condition.ConditionalOnAddJenkinsFile;
import io.spring.start.site.extension.svc.condition.ConditionalOnAddSampleUI;

import org.springframework.context.annotation.Bean;

/**
 * Project generation configuration class to add our configuration to the context.
 *
 * @author swathi udayar
 */
@ProjectGenerationConfiguration
public class SimpleBootCustomConfiguration {

	/*
	 * Add JenkinsFileContributor bean to application context only if add jenkins file
	 * checkbox is checked in ui
	 */
	@Bean
	@ConditionalOnAddJenkinsFile("true")
	public ProjectContributor jenkinsFileContributor() {
		return new JenkinsFileContributor("classpath:svc_templates");
	}

	/*
	 * Add sampleAngularJSUIContributor bean to application context only if add angularjs
	 * client code checkbox is checked in ui
	 */
	@Bean
	@ConditionalOnAddSampleUI("true")
	public ProjectContributor sampleAngularJSUIContributor() {
		return new SampleAngularJSUIContributor(
				"classpath:svc_templates/angularjs_sample_code");
	}

}
